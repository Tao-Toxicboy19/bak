import express from "express";
import multer from "multer";
import { Request, Response } from "express";
import { RootController } from "../controllers/RootController";
import { DeleteFTSController, GetByIdFTS, GetFTSController, PostFTSController, UpdateFTSController } from "../controllers/FTS.controller";
import { DeleteCarrierController, GetCarrierController, GetbyIdCarrier, PostCarrierController, PutCarrierController } from "../controllers/CarrierController";
import { DeleteCargoController, GetCargoController, GetbyId, PostCargoController, UpdateCargoController } from "../controllers/CargoController";
import { DeleteOrderController, GetOrderController, PostOrderController, UpdateOrderController, UpdateStatusApproved_order, UpdateStatusAssign_order, UpdateStatusOrder, deleteManyOrder, deleteManyOrdersChackbox, exportCsvOrders, exportOrder, getSignOrder, importCSVOrders, statusFTS } from "../controllers/OrdersController";
import { DeleteCargoCraneController, GetCargoCranesController, GetbyIdCargoCrane, PostCargoCraneController, PutCargoCraneController, } from "../controllers/Cranecargo.controller";
import { GrantPermissions, Login, Register, findAllUser, roles } from "../controllers/auth.controller";
import { FtsSolutionSigle, crane_solution_v2, cranesolution, cranesolutiontable, ftssolution } from "../controllers/solution.controller";
import { CraneDelete, GetByIdCrane, GetCrane, UpdateCrane, createCrane } from "../controllers/crane.controller";
import { craneTable, crane_solutionV2, createPlan, getPlan, removePlan, report_solution, report_solution_crane, solutionCrane, solution_carrier_order, solution_carrier_orderSum, solution_schedule, tableTotal, totalCost } from "../controllers/solution_schedule.controller";
import { getLastCargoOrderIdController, postCargoOrderController, putCargoOrderController } from "../controllers/CargoOrder.controller";
import { deleteMainTainCrane, deleteMainTainFTS, deleteNoti, getMainTainCrane, getMainTainCraneById, getMainTainFTS, getMainTainFTSById, postMainTainCrane, postMainTainFTS, putMainTainCrane, putMainTainFTS } from "../controllers/maintainCraneController";
import { auth } from "../middleware/auth";
import { signin, signup } from "../controllers/loginController";

export const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", RootController);
router.post("/register", Register)
router.post("/login", Login);

router.post('/backend/signin', signin)
router.post('/backend/signup', signup)

router.patch('/user/:id', auth, GrantPermissions)
router.get("/userall", auth, findAllUser);
router.post('/roles', auth, roles);

router.get("/floating", GetFTSController);
router.get("/floating/:id", GetByIdFTS);
router.post("/floating", PostFTSController);
router.put("/floating/:id", UpdateFTSController);
router.delete("/floating/:id", DeleteFTSController);

router.get('/crane', GetCrane);
router.post('/crane', createCrane);
router.put('/crane/:id', UpdateCrane);
router.get('/crane/:id', GetByIdCrane);
router.delete('/crane/:id', CraneDelete)

router.get("/cargocrane", GetCargoCranesController);
router.get("/cargocrane/:id", GetbyIdCargoCrane);
router.post("/cargocrane", PostCargoCraneController);
router.put("/cargocrane/:id", PutCargoCraneController);
router.delete("/cargocrane/:id", DeleteCargoCraneController);

router.get("/carrier", GetCarrierController);
router.post("/carrier", PostCarrierController);
router.get("/carrier/:id", GetbyIdCarrier);
router.put("/carrier/:id", PutCarrierController);
router.delete("/carrier/:id", DeleteCarrierController);

router.get("/cargo", GetCargoController);
router.get("/cargo/:id", GetbyId);
router.post("/cargo", PostCargoController);
router.put("/cargo/:id", UpdateCargoController);
router.delete("/cargo/:id", DeleteCargoController);

router.post('/cargoorder', postCargoOrderController)
router.get('/cargoorder', getLastCargoOrderIdController)
router.put('/cargoorder/:id', putCargoOrderController)

router.get("/order", GetOrderController);
router.get("/order/:id", getSignOrder);
router.post("/order", PostOrderController);
router.patch("/order/:id", UpdateOrderController);
router.delete("/order/:id", DeleteOrderController);

router.get('/cranesolution/:id', cranesolution)
router.get('/fts-solution-sigle', FtsSolutionSigle)
router.get('/ftssolution/:id', ftssolution)

router.get('/cranesolutiontable/:id', cranesolutiontable)
router.get('/cranesolutiontableV2', crane_solution_v2)

router.get('/report_solution/:id', report_solution)
router.get('/report_solution_crane/:id', report_solution_crane)

router.get('/solution_schedule/:id', solution_schedule)

router.get('/solution_carrier_order_sum', solution_carrier_orderSum)
router.get('/solution_carrier_order/:id', solution_carrier_order)

router.get('/maintain_crane/:group', getMainTainCrane)
router.get('/maintain_crane/get/:id', getMainTainCraneById)
router.put('/maintain_crane/:id', putMainTainCrane)
router.post('/maintain_crane', postMainTainCrane)
router.delete('/maintain_crane/:id', deleteMainTainCrane)

router.get('/maintain_fts/:group', getMainTainFTS)
router.put('/maintain_fts/:id', putMainTainFTS)
router.get('/maintain_fts/get/:id', getMainTainFTSById)
router.post('/maintain_fts', postMainTainFTS)
router.delete('/maintain_fts/:id', deleteMainTainFTS)

router.patch('/updatestatus/:id', UpdateStatusAssign_order)
router.patch('/updatestatus-approved/:id', UpdateStatusApproved_order)
router.patch('/update-status-order/:id', UpdateStatusOrder)
router.patch('/update-statusFTS-order', statusFTS)

router.delete('/exportorder/:group', deleteManyOrder)
router.get('/exportorder/:id', exportCsvOrders)
router.post('/importcsv', upload.single("file"), importCSVOrders)
router.delete('/delete/orders', deleteManyOrdersChackbox)

router.get('/crane_solutionV2/:id', crane_solutionV2)
router.get('/totalCost', totalCost)

router.get('/total/table/fts/:id', tableTotal)
router.get('/total/table/crane/:id', solutionCrane)
router.get('/table/crane/:id', craneTable)

router.post('/order/export', exportOrder)

router.post('/plan', createPlan)
router.post('/plan/remove', removePlan)

router.get('/plan/:id', getPlan)

router.post('/delete/noti', deleteNoti)

export default router;
