import { Router, Request, Response } from "express";
import chatController from "../../controller/chat/chat.controller";
import { authorizedMiddleware } from "../../middleware/authorization.middleware";

const router: Router = Router();

router.get("/conversations", authorizedMiddleware, (req: Request, res: Response) =>
    chatController.getConversations(req, res),
);

router.get("/messages/:participantId", authorizedMiddleware, (req: Request, res: Response) =>
    chatController.getConversationMessages(req, res),
);

router.post("/messages/:participantId", authorizedMiddleware, (req: Request, res: Response) =>
    chatController.createMessage(req, res),
);

router.get("/contacts", authorizedMiddleware, (req: Request, res: Response) =>
    chatController.getContacts(req, res),
);

export default router;
