import { Request, Response } from "express";

export const RootController = (req: Request, res: Response) => {

    if ((req.session as any).email) {
        return res.json({ valid: true, email: (req.session as any).email, });
    } else {
        return res.json({ valid: false });
    }
}