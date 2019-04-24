export namespace protos {
  export namespace user {
    export interface User {
      username: string;
      info: protos.Info.User;
    }
  }

  export namespace Info {
    export interface User {
      name: protos.Info.Name;
    }

    export interface Name {
      firstName: string;
      lastName: string;
    }
  }
}
