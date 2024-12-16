"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootController = void 0;
const RootController = (req, res) => {
    if (req.session.email) {
        return res.json({ valid: true, email: req.session.email, });
    }
    else {
        return res.json({ valid: false });
    }
};
exports.RootController = RootController;
