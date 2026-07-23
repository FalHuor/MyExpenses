import { buildApp } from "../../../app";
import { testDependencies } from "./dependecies";

export async function createTestApp() {
    return await buildApp(testDependencies);
}