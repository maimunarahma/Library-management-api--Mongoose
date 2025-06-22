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
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
// console.log("DB Name:", process.env.dbName);
// console.log("DB Pass:", process.env.dbPass);
let server;
const PORT = 4000;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("index.ts running");
            yield mongoose_1.default.connect(`mongodb+srv://${process.env.dbName}:${process.env.dbPass}@cluster0.n0bjr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
            server = app_1.default.listen(PORT, () => {
                console.log(`app is listening on ${PORT}`);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
main();
