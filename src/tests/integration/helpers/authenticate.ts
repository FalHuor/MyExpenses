import { testDependencies } from "./dependecies";
import { createUser } from "./factory/user.factory";

export async function authenticate(overrides?: {
  email?: string;
  username?: string;
  password?: string;
}) {
  const user = await createUser(testDependencies.prisma, overrides);

  const token = testDependencies.tokenService.signAccessToken({
    id: user.id,
    email: user.email
  });

  return {
    user,
    token,
  };
}