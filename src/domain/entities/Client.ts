export class Client {
  constructor(
    public id: number,
    public name: string,
    public lastName: string,
    public email: string
  ) {}
}

export interface CreateClientDto {
  name: string;
  lastName: string;
  email: string;
}

export interface UpdateClientDto {
  name?: string;
  lastName?: string;
  email?: string;
}