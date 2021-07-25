import { resolve } from "path/posix";
import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

const makeEncrypter = (): Encrypter => {
  class EncryptStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncryptStub();
};

interface SutTypes {
  encryptStub: Encrypter;
  sut: DbAddAccount;
}

const makeSut = (): SutTypes => {
  const encryptStub = makeEncrypter();
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

  it("Should throw if Encrypter throws", async () => {
    const { sut, encryptStub } = makeSut();
    jest
      .spyOn(encryptStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
});
