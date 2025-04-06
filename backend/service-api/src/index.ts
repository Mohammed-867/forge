import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

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

const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

app.post(
  "/bulk-create-property",
  async (req: Request, res: Response): Promise<any> => {
    const data = req.body;
    try {
      for (let urlData of data) {
        const { url, data } = urlData;
        const insertingUrl = await prisma.url.upsert({
          where: {
            url,
          },
          update: {},
          create: {
            url,
          },
        });
        const urlId = insertingUrl.id;
        const propertiesToInsert = data.map((property: ModelDataType) => ({
          urlId: urlId,
          property_name: property.property_name,
          price: property.price || null,
          square_feet: property.square_feet || null,
          property_type: property.property_type || null,
          construction_start_end_date:
            property.construction_start_end_date || null,
          total_construction_area: property.total_construction_area || null,
          floors: property.floors || null,
          property_height: property.property_height || null,
          address: property.address || null,
          soil_type: property.soil_type || null,
          issuing_authority: property.issuing_authority || null,
          promoter: property.promoter || null,
          contractor: property.contractor || null,
          architect_consultant: property.architect_consultant || null,
          tednder_details: property.tednder_details || null,
          tender_status: property.tender_status || null,
          concrete_grade_required: property.concrete_grade_required || null,
          construction_phase: property.construction_phase || null,
        }));
        const insertingProperties = await prisma.properties.createMany({
          data: propertiesToInsert,
          skipDuplicates: true,
        });

        console.log(
          `Created ${insertingProperties.count} properties for URL: ${url}`
        );
      }

      return res.status(200).json({
        message: "Data inserted into discover successfully",
      });
    } catch (err) {
      return res.status(500).json({
        message: `Error occured on property creation : ${err}`,
      });
    }
  }
);

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User found",
      userId: user.id,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Error occured on signin : ${err}`,
    });
  }
});

app.get("/links-scrapped", async (req, res) => {
  try {
    const links = await prisma.url.findMany();
    if (!links) {
      return res.status(200).json({
        message: "no links found",
      });
    } else {
      return res.status(200).json({
        data: links,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: `Error occured ${err}`,
    });
  }
});

const PORT = 3010;
app.listen(PORT, () => {
  console.log("server running on", PORT);
});
