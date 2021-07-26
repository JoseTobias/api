import {
  Encrypter,
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

const makeEncrypter = (): Encrypter => {
  class EncryptStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncryptStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeaccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email",
        password: "hashed_password",
      };
      return await new Promise((resolve) => resolve(fakeaccount));
    }
  }
  return new AddAccountRepositoryStub();
};

interface SutTypes {
  encryptStub: Encrypter;
  sut: DbAddAccount;
  AddAccountRepositoryStub: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const encryptStub = makeEncrypter();
  const AddAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encryptStub, AddAccountRepositoryStub);
  return {
    encryptStub,
    sut,
    AddAccountRepositoryStub,
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

  it("Should call AddAccountRepository with correct values", async () => {
    const { sut, AddAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(AddAccountRepositoryStub, "add");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });
});
