import type { Dependencies } from "../../core/dependencies";
import { BankController } from "./bank.controller";
import { BankRepository } from "./bank.repository";
import { createBankRoutes } from "./bank.routes";
import { BankService } from "./bank.service";

export function createBankModule(dependencies: Dependencies) {

  const bankRepository = new BankRepository(dependencies.prisma);
  const bankService = new BankService(bankRepository);
  const bankController = new BankController(bankService);
  const bankRoutes = createBankRoutes(bankController);

  return {
    service: bankService,
    controller: bankController,
    routes: bankRoutes,
  }
}