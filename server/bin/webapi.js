"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("./repository");
const repository = new repository_1.Repository();
class WebAPI {
    static register(app) {
        const apiBaseUrl = "/api/meeting";
        app.get(apiBaseUrl, WebAPI.getMeeting);
        app.post(apiBaseUrl, WebAPI.addMember);
        app.put(apiBaseUrl, WebAPI.updateMember);
        app.delete(apiBaseUrl + ':id', WebAPI.deleteMember);
    }
    static getMeeting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Retrieving meeting");
            try {
                let result = yield repository.getMeeting();
                debugger;
                res.json(result);
            }
            catch (error) {
                console.log(error);
                res.sendStatus(500);
            }
        });
    }
    static addMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Retrieving meeting");
            try {
                let result = yield repository.addMember(req.body);
                res.json(result);
            }
            catch (error) {
                console.log(error);
                res.sendStatus(500);
            }
        });
    }
    static updateMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Retrieving meeting");
            try {
                let result = yield repository.updateMember(req.body);
                res.json(result);
            }
            catch (error) {
                console.log(error);
                res.sendStatus(500);
            }
        });
    }
    static deleteMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Retrieving meeting");
            try {
                let result = yield repository.deleteMember(req.params.id);
                res.json(result);
            }
            catch (error) {
                console.log(error);
                res.sendStatus(500);
            }
        });
    }
}
exports.WebAPI = WebAPI;
exports.default = WebAPI;
//# sourceMappingURL=webapi.js.map