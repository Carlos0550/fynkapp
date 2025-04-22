import { Request } from "express";

export interface AuthenticatedRequest<
P = {},
ResBody = any,
ReqBody = any,
ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
user_id: string;
user?: { user_id: string; [key: string]: any };
}