import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
  encryptStub: Encrypter;
  sut: DbAddAccount;
}

const makeSut = (): SutTypes => {
  class EncryptStub {
    async encrypt(value: string): Promise<string> {
      return await new Promise((resolve) => resolve("hashed_password"));
    }
  }
  const encryptStub = new EncryptStub();
  const sut = new DbAddAccount(encryptStub);
  return {
    encryptStub,
    sut,
  };
};

describe("DbAddAccount Usecases", () => {
  it("Should call Encrypter with correct password", async () => {
    const { sut, encryptStub } = makeSut();
    const encryptSpy = jest.spyOn(encryptStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });
});
