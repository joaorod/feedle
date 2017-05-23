/// <reference path="../../model/model.d.ts" />
import * as express from "express";
import { Request, Response } from "express";
import { Repository } from "./repository";

const repository = new Repository(); 

export class WebAPI {
    
    public static register(app: express.Router) {
        const apiBaseUrl = "/api/meeting";
        app.get(apiBaseUrl, WebAPI.getMeeting);
        app.post(apiBaseUrl,WebAPI.addMember);
        app.put(apiBaseUrl, WebAPI.updateMember);
        //app.delete(apiBaseUrl +':id',WebAPI.deleteMember)
    }
    
    private static async getMeeting(req: Request, res: Response) {
        console.log("Retrieving meeting");
        try {
            let result = await repository.getMeeting();
            res.json(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    private static async addMember(req: Request, res: Response) {
        console.log("Adding member:" + JSON.stringify(req.body));
        try {
            let result = await repository.addMember(req.body);
            res.json(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    private static async updateMember(req: Request, res: Response) {
        console.log("Updating member:" + JSON.stringify(req.body));
        try {
            let result = await repository.updateMember(req.body);
            res.json(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
}

export default WebAPI;
