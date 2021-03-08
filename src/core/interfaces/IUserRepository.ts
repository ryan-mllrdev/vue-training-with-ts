import { IGithubUser } from "./IGithubUser";

export interface IUserRepository {
    id: number;
    owner: IGithubUser;
    name: string;
    full_name: string;
    html_url: string;
}