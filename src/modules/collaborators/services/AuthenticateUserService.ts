import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { jwt } from '@config/auth';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { Collaborator } from '../infra/mysql/entities/Collaborator';
import { ICollaboratorsRepository } from '../repositories/ICollaboratorsRepository';

interface IRequest {
  login: string;
  password: string;
}

interface IResponse {
  collaborator: Collaborator;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('CollaboratorRepository')
    private collaboratorRepository: ICollaboratorsRepository,
  ) {}

  public async execute({ login, password }: IRequest): Promise<IResponse> {
    const collaborator = await this.collaboratorRepository.findByLogin(login);

    if (!collaborator) {
      throw new AppError('Incorrect login/password combination');
    }

    const passwordMached = await compare(password, collaborator.senha);

    if (!passwordMached) {
      throw new AppError('Incorrect login/password combination');
    }

    const token = sign({}, jwt.secret, {
      subject: login,
      expiresIn: jwt.expiresIn,
    });

    return {
      collaborator,
      token,
    };
  }
}

export { AuthenticateUserService };
