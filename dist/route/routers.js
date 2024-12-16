"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const RootController_1 = require("../controllers/RootController");
const FTS_controller_1 = require("../controllers/FTS.controller");
const CarrierController_1 = require("../controllers/CarrierController");
const CargoController_1 = require("../controllers/CargoController");
const OrdersController_1 = require("../controllers/OrdersController");
const Cranecargo_controller_1 = require("../controllers/Cranecargo.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const solution_controller_1 = require("../controllers/solution.controller");
const crane_controller_1 = require("../controllers/crane.controller");
const solution_schedule_controller_1 = require("../controllers/solution_schedule.controller");
const CargoOrder_controller_1 = require("../controllers/CargoOrder.controller");
const maintainCraneController_1 = require("../controllers/maintainCraneController");
const auth_1 = require("../middleware/auth");
const loginController_1 = require("../controllers/loginController");
exports.router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
exports.router.get("/", RootController_1.RootController);
exports.router.post("/register", auth_controller_1.Register);
exports.router.post("/login", auth_controller_1.Login);
exports.router.post('/backend/signin', loginController_1.signin);
exports.router.post('/backend/signup', loginController_1.signup);
exports.router.patch('/user/:id', auth_1.auth, auth_controller_1.GrantPermissions);
exports.router.get("/userall", auth_1.auth, auth_controller_1.findAllUser);
exports.router.post('/roles', auth_1.auth, auth_controller_1.roles);
exports.router.get("/floating", FTS_controller_1.GetFTSController);
exports.router.get("/floating/:id", FTS_controller_1.GetByIdFTS);
exports.router.post("/floating", FTS_controller_1.PostFTSController);
exports.router.put("/floating/:id", FTS_controller_1.UpdateFTSController);
exports.router.delete("/floating/:id", FTS_controller_1.DeleteFTSController);
exports.router.get('/crane', crane_controller_1.GetCrane);
exports.router.post('/crane', crane_controller_1.createCrane);
exports.router.put('/crane/:id', crane_controller_1.UpdateCrane);
exports.router.get('/crane/:id', crane_controller_1.GetByIdCrane);
exports.router.delete('/crane/:id', crane_controller_1.CraneDelete);
exports.router.get("/cargocrane", Cranecargo_controller_1.GetCargoCranesController);
exports.router.get("/cargocrane/:id", Cranecargo_controller_1.GetbyIdCargoCrane);
exports.router.post("/cargocrane", Cranecargo_controller_1.PostCargoCraneController);
exports.router.put("/cargocrane/:id", Cranecargo_controller_1.PutCargoCraneController);
exports.router.delete("/cargocrane/:id", Cranecargo_controller_1.DeleteCargoCraneController);
exports.router.get("/carrier", CarrierController_1.GetCarrierController);
exports.router.post("/carrier", CarrierController_1.PostCarrierController);
exports.router.get("/carrier/:id", CarrierController_1.GetbyIdCarrier);
exports.router.put("/carrier/:id", CarrierController_1.PutCarrierController);
exports.router.delete("/carrier/:id", CarrierController_1.DeleteCarrierController);
exports.router.get("/cargo", CargoController_1.GetCargoController);
exports.router.get("/cargo/:id", CargoController_1.GetbyId);
exports.router.post("/cargo", CargoController_1.PostCargoController);
exports.router.put("/cargo/:id", CargoController_1.UpdateCargoController);
exports.router.delete("/cargo/:id", CargoController_1.DeleteCargoController);
exports.router.post('/cargoorder', CargoOrder_controller_1.postCargoOrderController);
exports.router.get('/cargoorder', CargoOrder_controller_1.getLastCargoOrderIdController);
exports.router.put('/cargoorder/:id', CargoOrder_controller_1.putCargoOrderController);
exports.router.get("/order", OrdersController_1.GetOrderController);
exports.router.get("/order/:id", OrdersController_1.getSignOrder);
exports.router.post("/order", OrdersController_1.PostOrderController);
exports.router.patch("/order/:id", OrdersController_1.UpdateOrderController);
exports.router.delete("/order/:id", OrdersController_1.DeleteOrderController);
exports.router.get('/cranesolution/:id', solution_controller_1.cranesolution);
exports.router.get('/fts-solution-sigle', solution_controller_1.FtsSolutionSigle);
exports.router.get('/ftssolution/:id', solution_controller_1.ftssolution);
exports.router.get('/cranesolutiontable/:id', solution_controller_1.cranesolutiontable);
exports.router.get('/cranesolutiontableV2', solution_controller_1.crane_solution_v2);
exports.router.get('/report_solution/:id', solution_schedule_controller_1.report_solution);
exports.router.get('/report_solution_crane/:id', solution_schedule_controller_1.report_solution_crane);
exports.router.get('/solution_schedule/:id', solution_schedule_controller_1.solution_schedule);
exports.router.get('/solution_carrier_order_sum', solution_schedule_controller_1.solution_carrier_orderSum);
exports.router.get('/solution_carrier_order/:id', solution_schedule_controller_1.solution_carrier_order);
exports.router.get('/maintain_crane/:group', maintainCraneController_1.getMainTainCrane);
exports.router.get('/maintain_crane/get/:id', maintainCraneController_1.getMainTainCraneById);
exports.router.put('/maintain_crane/:id', maintainCraneController_1.putMainTainCrane);
exports.router.post('/maintain_crane', maintainCraneController_1.postMainTainCrane);
exports.router.delete('/maintain_crane/:id', maintainCraneController_1.deleteMainTainCrane);
exports.router.get('/maintain_fts/:group', maintainCraneController_1.getMainTainFTS);
exports.router.put('/maintain_fts/:id', maintainCraneController_1.putMainTainFTS);
exports.router.get('/maintain_fts/get/:id', maintainCraneController_1.getMainTainFTSById);
exports.router.post('/maintain_fts', maintainCraneController_1.postMainTainFTS);
exports.router.delete('/maintain_fts/:id', maintainCraneController_1.deleteMainTainFTS);
exports.router.patch('/updatestatus/:id', OrdersController_1.UpdateStatusAssign_order);
exports.router.patch('/updatestatus-approved/:id', OrdersController_1.UpdateStatusApproved_order);
exports.router.patch('/update-status-order/:id', OrdersController_1.UpdateStatusOrder);
exports.router.patch('/update-statusFTS-order', OrdersController_1.statusFTS);
exports.router.delete('/exportorder/:group', OrdersController_1.deleteManyOrder);
exports.router.get('/exportorder/:id', OrdersController_1.exportCsvOrders);
exports.router.post('/importcsv', upload.single("file"), OrdersController_1.importCSVOrders);
exports.router.delete('/delete/orders', OrdersController_1.deleteManyOrdersChackbox);
exports.router.get('/crane_solutionV2/:id', solution_schedule_controller_1.crane_solutionV2);
exports.router.get('/totalCost', solution_schedule_controller_1.totalCost);
exports.router.get('/total/table/fts/:id', solution_schedule_controller_1.tableTotal);
exports.router.get('/total/table/crane/:id', solution_schedule_controller_1.solutionCrane);
exports.router.get('/table/crane/:id', solution_schedule_controller_1.craneTable);
exports.router.post('/order/export', OrdersController_1.exportOrder);
exports.router.post('/plan', solution_schedule_controller_1.createPlan);
exports.router.post('/plan/remove', solution_schedule_controller_1.removePlan);
exports.router.get('/plan/:id', solution_schedule_controller_1.getPlan);
exports.router.post('/delete/noti', maintainCraneController_1.deleteNoti);
exports.default = exports.router;
