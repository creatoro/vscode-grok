"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToGrok = void 0;
const axios_1 = __importDefault(require("axios"));
const const_1 = require("./const");
async function sendToGrok(apiKey, model, content) {
    const response = await axios_1.default.post(const_1.API_URL, {
        messages: [{ role: "user", content }],
        model,
        stream: false,
        temperature: 0,
    }, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
}
exports.sendToGrok = sendToGrok;
//# sourceMappingURL=api.js.map