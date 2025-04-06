"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const prisma = new client_1.PrismaClient();
app.post("/bulk-create-property", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        for (let urlData of data) {
            const { url, data } = urlData;
            const insertingUrl = yield prisma.url.upsert({
                where: {
                    url,
                },
                update: {},
                create: {
                    url,
                },
            });
            const urlId = insertingUrl.id;
            const propertiesToInsert = data.map((property) => ({
                urlId: urlId,
                property_name: property.property_name,
                price: property.price || null,
                square_feet: property.square_feet || null,
                property_type: property.property_type || null,
                construction_start_end_date: property.construction_start_end_date || null,
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
            const insertingProperties = yield prisma.properties.createMany({
                data: propertiesToInsert,
                skipDuplicates: true,
            });
            console.log(`Created ${insertingProperties.count} properties for URL: ${url}`);
        }
        return res.status(200).json({
            message: "Data inserted into discover successfully",
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Error occured on property creation : ${err}`,
        });
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findFirst({
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
    }
    catch (err) {
        return res.status(500).json({
            message: `Error occured on signin : ${err}`,
        });
    }
}));
app.get("/links-scrapped", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const links = yield prisma.url.findMany();
        if (!links) {
            return res.status(200).json({
                message: "no links found",
            });
        }
        else {
            return res.status(200).json({
                data: links,
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            message: `Error occured ${err}`,
        });
    }
}));
const PORT = 3010;
app.listen(PORT, () => {
    console.log("server running on", PORT);
});
