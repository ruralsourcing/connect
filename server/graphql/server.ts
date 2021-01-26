import {
  ApolloServer,
  PubSub,
  gql,
  withFilter,
  IResolvers,
} from "apollo-server-express";
import TechDataSource from "./datasources/TechDataSource";
import { DataSources } from "apollo-server-core/dist/graphqlOptions";
import TechDataContext from "../data/TechDataContext";
import SkillDataSource from "./datasources/SkillsDataSource";
import SkillDataContext from "../data/SkillDataContext";
import { AuthContext } from "../middleware/AuthContext";
import UserDataContext from "../data/UserDataContext";
import UserDataSource from "./datasources/UsersDataSource";
import ZoomDataSource from "./datasources/ZoomDataSource";
import ZoomDataContext from "../data/ZoomDataContext";
import TechnologyResolvers, {
  TechnologyTypeDefs,
} from "./resolvers/TechnologyResolvers";
import SkillsResolvers, { SkillsTypeDefs } from "./resolvers/SkillsResolvers";
import AffirmationsResolvers, {
  AffirmationsTypeDefs,
} from "./resolvers/AffirmationsResolvers";
import UsersResolvers, { UsersTypeDefs } from "./resolvers/UsersResolvers";
import ZoomResolvers, { ZoomTypeDefs } from "./resolvers/ZoomResolvers";
import MeetingsResolvers, {
  MeetingsTypeDefs,
} from "./resolvers/MeetingsResolvers";
import { DocumentNode } from "graphql";

const rootTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`;
interface IDataSources {
  techApi: TechDataSource;
  skillApi: SkillDataSource;
  userApi: UserDataSource;
  zoomApi: ZoomDataSource;
}

// const dataSources: DataSources<IDataSources> = {
//   techApi: new TechDataSource(new TechDataContext()),
//   skillApi: new SkillDataSource(new SkillDataContext()),
//   userApi: new UserDataSource(new UserDataContext()),
//   zoomApi: new ZoomDataSource(new ZoomDataContext()),
// };

// const typeDefs = [
//   AffirmationsTypeDefs,
//   MeetingsTypeDefs,
//   SkillsTypeDefs,
//   TechnologyTypeDefs,
//   UsersTypeDefs,
//   ZoomTypeDefs,
// ];

// const resolvers: IResolvers[] = [
//   new AffirmationsResolvers(pubsub).resolvers,
//   new MeetingsResolvers(pubsub).resolvers,
//   new SkillsResolvers(pubsub).resolvers,
//   new TechnologyResolvers().resolvers,
//   new UsersResolvers().resolvers,
//   new ZoomResolvers().resolvers,
// ];

// const dataContext = new UserDataContext();
// const context = new AuthContext(dataContext);
// export default new ApolloServer({
//   typeDefs: [rootTypeDefs, ...typeDefs],
//   resolvers: resolvers,
//   dataSources: () => dataSources,
//   introspection: true,
//   // playground: true,
//   context: async ({ req, connection }) => {
//     if (connection) {
//       // check connection for metadata
//       return connection.context;
//     } else {
//       // get the user token from the headers
//       const token = req?.headers?.authorization?.split(" ")[1];
//       let user;
//       if (token) {
//         try {
//           //console.info("[ACCESS TOKEN]", token)
//           const decoded = await context.decode(token);
//           //console.log("[TOKEN INFO]", decoded, token);
//           user = await context.getUser(decoded);
//           //console.log('[USER CONTEXT]', user)
//         } catch (ex) {
//           console.error("[X0001]", ex.message);
//         }
//       }

//       // optionally block the user
//       // we could also check user roles/permissions here
//       //if (!user) throw new AuthenticationError("you must be logged in");

//       // add the user to the context
//       return { user };
//     }
//   },
//   subscriptions: {
//     onConnect: async (connectionParams: any, webSocket) => {
//       let user;
//       try {
//         if (connectionParams.authToken !== "") {
//           const decoded = await context.decode(connectionParams.authToken);
//           user = await context.getUser(decoded);
//           return {
//             user: user,
//           };
//         }
//       } catch (ex) {
//         console.error(ex);
//       }
//       return {
//         currentUser: null,
//       };
//     },
//   },
// });

export default class GraphQLServer {
  typedefs: Array<DocumentNode>;
  resolvers: IResolvers[];
  pubsub: PubSub;
  datasources: DataSources<IDataSources>;
  private dataContext: UserDataContext;
  private authContext: AuthContext;

  constructor(pubsub: PubSub) {
    this.pubsub = pubsub;
    this.dataContext = new UserDataContext();
    this.authContext = new AuthContext(this.dataContext);
    this.datasources = {
      techApi: new TechDataSource(new TechDataContext()),
      skillApi: new SkillDataSource(new SkillDataContext()),
      userApi: new UserDataSource(new UserDataContext()),
      zoomApi: new ZoomDataSource(new ZoomDataContext()),
    };
    this.typedefs = [
      AffirmationsTypeDefs,
      MeetingsTypeDefs,
      SkillsTypeDefs,
      TechnologyTypeDefs,
      UsersTypeDefs,
      ZoomTypeDefs,
    ];
    this.resolvers = [
      new AffirmationsResolvers(pubsub).resolvers,
      new MeetingsResolvers(pubsub).resolvers,
      new SkillsResolvers(pubsub).resolvers,
      new TechnologyResolvers().resolvers,
      new UsersResolvers().resolvers,
      new ZoomResolvers().resolvers,
    ];
  }

  server() {
    return new ApolloServer({
      typeDefs: [rootTypeDefs, ...this.typedefs],
      resolvers: this.resolvers,
      dataSources: () => this.datasources,
      introspection: true,
      // playground: true,
      context: async ({ req, connection }) => {
        if (connection) {
          // check connection for metadata
          return connection.context;
        } else {
          // get the user token from the headers
          const token = req?.headers?.authorization?.split(" ")[1];
          let user;
          if (token) {
            try {
              //console.info("[ACCESS TOKEN]", token)
              const decoded = await this.authContext.decode(token);
              //console.log("[TOKEN INFO]", decoded, token);
              user = await this.authContext.getUser(decoded);
              //console.log('[USER CONTEXT]', user)
            } catch (ex) {
              console.error("[X0001]", ex.message);
            }
          }

          // optionally block the user
          // we could also check user roles/permissions here
          //if (!user) throw new AuthenticationError("you must be logged in");

          // add the user to the context
          return { user };
        }
      },
      subscriptions: {
        onConnect: async (connectionParams: any, webSocket) => {
          let user;
          try {
            if (connectionParams.authToken !== "") {
              const decoded = await this.authContext.decode(connectionParams.authToken);
              user = await this.authContext.getUser(decoded);
              return {
                user: user,
              };
            }
          } catch (ex) {
            console.error(ex);
          }
          return {
            currentUser: null,
          };
        },
      },
    });
  }
}
