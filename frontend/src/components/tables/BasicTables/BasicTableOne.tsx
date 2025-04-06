import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";


interface ModelDataType {
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

interface ModelAllDatatype {
  url: string;
  data: ModelDataType[];
  dropDown: boolean;
}


interface PropsType {
  property: ModelAllDatatype;
}

const tableHeaders = [
  "Property Name",
  "Price",
  "Square Feet",
  "Property Type",
  "Constructions Dates",
  "Total Construction Area",
  "Floors",
  "Property Height",
  "Address",
  "Soil Type",
  "Issuing Authority",
  "Promoter",
  "Contractor",
  "Architect Consultant",
  "Tender Details",
  "Tender Status",
  "Concrete Grade",
  "Construction Phase",
];


export default function BasicTableOne({ property }: PropsType) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div>
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {property.data.map((singleProperty, index) => (
                <TableRow key={index}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-800 text-theme-sm dark:text-white/90">
                      {singleProperty.property_name
                        ? `${singleProperty.property_name}`
                        : "nil"}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.price || "nil"}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.square_feet
                        ? `${singleProperty.square_feet}`
                        : "nil"}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.property_type || "nil"}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.construction_start_end_date || "nil"}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.total_construction_area || "nil"}
                    </span>
                  </TableCell>{" "}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.floors
                        ? `${singleProperty.floors}`
                        : "nil"}
                    </span>
                  </TableCell>{" "}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.property_height
                        ? `${singleProperty.property_height}`
                        : "nil"}
                    </span>
                  </TableCell>{" "}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.address || "nil"}
                    </span>
                  </TableCell>{" "}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.soil_type || "nil"}
                    </span>
                  </TableCell>{" "}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.issuing_authority || "nil"}
                    </span>
                  </TableCell>{" "}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.promoter || "nil"}
                    </span>
                  </TableCell>{" "}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.contractor || "nil"}
                    </span>
                  </TableCell>{" "}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.architect_consultant || "nil"}
                    </span>
                  </TableCell>{" "}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.tednder_details || "nil"}
                    </span>
                  </TableCell>{" "}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.tender_status || "nil"}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.concrete_grade_required || "nil"}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium w-[7rem] text-gray-500 text-theme-sm dark:text-gray-400">
                      {singleProperty.construction_phase || "nil"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
