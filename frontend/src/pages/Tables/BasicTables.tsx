// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { memo, useState } from "react";
import { toast, Toaster } from "sonner";
import readXlsxFile from "read-excel-file";
import Dropzone from "react-dropzone";
import FileUploadIcon from "@/components/ui/file-upload-icon";
import Spinner from "@/components/ui/spinner";
import ExportIcon from "@/components/ui/export-icon";
import WhiteSpinner from "@/components/ui/white-spinner";

export interface ScrappedData {
  title: string;
  data: string;
}

export interface ModelDataType {
  price: string;
  property_name: string;
  property_type: string | null;
  construction_start_end_date: string | null;
  total_construction_area: string | null;
  floors: string | null;
  property_height: string | null;
  address: string | null;
  soil_type: string | null;
  issuing_authority: string | null;
  promoter: string | null;
  contractor: string | null;
  architect_consultant: string | null;
  tednder_details: string | null;
  tender_status: string | null;
  concrete_grade_required: string | null;
  construction_phase: string | null;
  square_feet: string | null;
}

export interface ModelAllDatatype {
  url: string;
  data: ModelDataType[];
  dropDown: boolean;
}

export interface CrawlerOptions {
  includes?: string[];
  excludes?: string[];
  maxDepth?: number;
  limit?: number;
  returnOnlyUrls: boolean;
}

export interface ScrapeOptions {
  formats?: string[];
  onlyMainContent?: boolean;
}

export interface PageOptions {
  onlyMainContent: boolean;
}

export interface RequestBody {
  url: string;
  crawlerOptions?: CrawlerOptions;
  pageOptions?: PageOptions;
  search?: string;
  excludePaths?: string[];
  includePaths?: string[];
  maxDepth?: number;
  limit?: number;
  scrapeOptions?: ScrapeOptions;
  formats?: string[];
}

const API_URL = import.meta.env.VITE_SCRPER_API_URL;
const DB_API_URL = import.meta.env.VITE_DB_API_URL;
const BasicTables = memo(() => {
  const [, setScrappedUrl] = useState<ScrappedData[]>([]);
  const [finalData, setFinalData] = useState<ModelAllDatatype[]>([]);
  const [doneTransforming, setDoneTransforming] = useState(false);
  const [doneScrapping, setDoneScrapping] = useState(false);
  const [scrappingStarted, setScrappingStarted] = useState(false);
  const [loadingDatabase, setLoadingDatabase] = useState(false);
  const [inProgress, setInProgress] = useState(0);

  const handleFileUpload = async (file: File[]) => {
    if (!file?.length) {
      toast.error("no file found", {
        position: "top-center",
      });
    }
    try {
      const readExcelFile = await readXlsxFile(file[0]);
      console.log(readExcelFile);
      const excelData = readExcelFile.map((row) => {
        return {
          url: row[0],
        };
      });
      setScrappingStarted(true);
      const modifiedExcel = excelData.slice(1);
      modifiedExcel.forEach(async (data) => {
        await handleScrap(data.url.toString());
      });
    } catch (error) {
      toast.error(`error in file upload : ${error}`, {
        position: "top-center",
      });
    }
  };

  const handleScrap = async (url: string) => {
    try {
      const endpoint = `${API_URL}/v1/scrape`;
      const requestBody: RequestBody = {
        url: url,
        formats: ["markdown"],
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const scrappedMarkDown = await data.data.markdown.slice(0, 10000);
      const scrappedTitle = await data.data.metadata.title;
      setScrappedUrl((prevScrappedUrls) => [
        ...prevScrappedUrls,
        { url: url, title: scrappedTitle, data: scrappedMarkDown },
      ]);
      await handleModelCall(url, scrappedMarkDown);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setDoneScrapping(true);
    }
  };

  const handleModelCall = async (url: string, data: ScrappedData[]) => {
    setInProgress((prev) => prev + 1);
    try {
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `You are a data analyst working for a Fortune 100 company. Analyze the markdown data provided and extract the following data and injest into the json below also make sure the property_name is not empty : price,property_name, property_type,construction_start_end_date, total_construction_area, floors, property_height,address,soil_type, issuing_authority,promoter,contractor,architect_consultant,tednder_details,tender_status, concrete_grade_required,construction_phase, and square_feet. Ensure that you only include these fields in the JSON response and if you find no similar data, respond with empty string value. The output should strictly follow this format:
                [
                  {
                    "price": "<price_value>",
                    "property_name": "<property_name_value>",
                    "property_type": "<property_type_value>",
                    "construction_start_end_date": "<construction_start_end_date_value>",
                    "total_construction_area": "<total_construction_area_value>",
                    "floors": "<floors_value>",
                    "property_height": "<property_height_value>",
                    "address": "<address_value>",
                    "soil_type": "<soil_type_value>",
                    "issuing_authority": "<issuing_authority_value>",
                    "promoter": "<promoter_value>",
                    "contractor": "<contractor_value>",
                    "architect_consultant": "<architect_consultant_value>",
                    "tednder_details": "<tednder_details_value>",
                    "tender_status": "<tender_status_value>",
                    "concrete_grade_required": "<concrete_grade_required_value>",
                    "construction_phase": "<construction_phase_value>",
                    "square_feet": "<square_feet_value>"
                  }
                ]
                Do not include any other information or additional fields. Only return the JSON structure as shown. Here's the markdown data: ${data}`,
              },
            ],
          },
        ],
      };

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD6bK9hB6fLjHHtqDU_-v6xl-YnVNzFRUY",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const parsedResponse = await response.json();
      const rawText = parsedResponse.candidates[0].content.parts[0].text;
      const jsonText = rawText.replace(/^```json\n|\n```$/g, "");
      const cleanedResponse = JSON.parse(jsonText);
      setFinalData((prev) => [
        ...prev,
        { url, data: cleanedResponse, dropDown: false },
      ]);
    } catch (err) {
      toast.error(`Error occured : ${err}`, {
        position: "top-center",
      });
      console.log("Error occured ", err);
    } finally {
      setInProgress((prev) => prev - 1);
      setDoneTransforming(true);
    }
  };

  const acceptedFileTypes = {
    "application/vnd.ms-excel": [".xls", ".xlsx"],
    // "text/csv": [".csv"],
  };

  const truncateString = (str: string, stringLength: number) => {
    if (str.length > stringLength) {
      return str.slice(0, stringLength) + ".....";
    }
    return str;
  };

  const handleToggle = (url: string) => {
    console.log("elicked", url);
    setFinalData((prevData) => {
      return prevData.map((property) =>
        property.url === url
          ? { ...property, dropDown: !property.dropDown }
          : property
      );
    });
  };

  const handleAddToDiscover = async () => {
    try {
      setLoadingDatabase(true);
      const response = await fetch(`${DB_API_URL}/bulk-create-property`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });
      const parsedResponse = await response.json();
      const toastMessage = parsedResponse.message;
      toast.success(toastMessage, {
        position: "top-center",
      });
    } catch (err) {
      setLoadingDatabase(false);
      toast.error(`Error on inserting into the db : ${err}`, {
        position: "top-center",
      });
    } finally {
      setLoadingDatabase(false);
    }
  };
  return (
    <>
      <Toaster />

      <PageMeta title="Nabil" description="" />
      {!doneTransforming ? (
        <div className="container mx-auto">
          <div className=" border-2 border-dotted rounded-lg">
            <Dropzone
              accept={acceptedFileTypes}
              onDrop={handleFileUpload}
              maxFiles={1}
            >
              {({ getRootProps, getInputProps }) => {
                return (
                  <div
                    {...getRootProps()}
                    className="flex flex-col items-center justify-center gap-3  p-10 text-center hover:cursor-pointer"
                  >
                    <input {...getInputProps()} />

                    <div className="flex flex-col items-center justify-center gap-2">
                      <button
                        // variant={"destructive"}
                        // size={"xl"}
                        className="text-white bg-red-400 rounded-md p-2 px-4 text-xl flex gap-3"
                      >
                        <FileUploadIcon />
                        Upload File
                      </button>
                      <p className="text-sm text-gray-500">
                        Or drop files here
                      </p>
                    </div>
                  </div>
                );
              }}
            </Dropzone>
          </div>
          <div className=" flex justify-between">
            <p className="text-sm text-gray-500 py-2">
              * use .xlsx or .xls files
            </p>
            <a
              href={`/assets/template.xlsx`}
              download="template.xlsx"
              className="text-sm underline hover:text-red-400 text-gray-500 py-2"
            >
              Download template
            </a>
          </div>
          {scrappingStarted && (!doneScrapping || !doneTransforming) && (
            <div className="flex justify-start gap-4 items-center">
              <p className="text-sm">Scrapping and Transforming Data</p>
              <div className="size-7">
                <Spinner />
              </div>
            </div>
          )}
        </div>
      ) : (
        <section className="flex flex-col gap-3">
          <>
            <div className="flex justify-end">
              <button
                className="flex gap-2 text-sm items-center bg-gray-800 text-white p-2 rounded-lg font-semibold"
                disabled={inProgress != 0}
                onClick={handleAddToDiscover}
              >
                <ExportIcon />
                Export to discover
                {loadingDatabase && (
                  <p className="size-5">
                    <WhiteSpinner />
                  </p>
                )}
              </button>
            </div>
            {inProgress > 0 ? (
              <p className="flex gap-2 items-center">
                Transforming {inProgress} more data{" "}
                <p className="size-7">{<Spinner />}</p>
              </p>
            ) : (
              ""
            )}
          </>
          {finalData.length > 0 && (
            <section className="flex flex-col gap-5">
              {finalData.map((property, index) => {
                return (
                  <div key={index} className="overflow-x-auto sm:rounded-lg">
                    <ComponentCard
                      title={`URL : ${truncateString(property.url, 80)}`}
                      url={property.url}
                      handleToggle={handleToggle}
                    >
                      {property.dropDown && (
                        <BasicTableOne property={property} />
                      )}
                    </ComponentCard>
                  </div>
                );
              })}
            </section>
          )}
        </section>
      )}
    </>
  );
});

export default BasicTables;
