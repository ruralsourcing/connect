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
const axios_1 = __importDefault(require("axios"));
class UserDataContext {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default
                .get("/api/users?")
                .then((d) => d.data)
                .catch((e) => {
                console.log(e);
                return [];
            });
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default
                .get(`/api/users/${id}?_embed=skills&_expand=session`)
                .then((d) => d.data)
                .catch((e) => {
                console.log(e);
                return {};
            });
        });
    }
    post(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.request({
                url: "/api/users",
                method: "post",
                data: item,
            }).then(response => {
                return response.data;
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`/api/users/${id}`);
        });
    }
    put(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.request({
                url: `/api/users/${item.id}`,
                data: item,
                method: "put",
            });
        });
    }
}
exports.default = UserDataContext;
