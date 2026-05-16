import { Router, Request, Response } from "express";
import chatController from "../../controller/chat/chat.controller";
import petAdvisorController from "../../controller/chat/pet-advisor.controller";
import { authorizedMiddleware } from "../../middleware/authorization.middleware";

const router: Router = Router();

// User-to-Provider Chat Routes
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

// Pet Advisor Routes
router.post("/pet-advisor", authorizedMiddleware, (req: Request, res: Response) =>
    petAdvisorController.chat(req, res),
);

router.get("/pet-advisor/history", authorizedMiddleware, (req: Request, res: Response) =>
    petAdvisorController.getHistory(req, res),
);

router.delete("/pet-advisor/history", authorizedMiddleware, (req: Request, res: Response) =>
    petAdvisorController.clearHistory(req, res),
);

export default router;
