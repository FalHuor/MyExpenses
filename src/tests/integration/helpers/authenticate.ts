import { testDependencies } from "./dependecies";
import { createUser } from "./factory/user.factory";

export async function authenticate() {
  const user = await createUser(testDependencies.prisma);

  const token = testDependencies.tokenService.signAccessToken({
    id: user.id,
    email: user.email
  });

  return {
    user,
    token,
  };
}