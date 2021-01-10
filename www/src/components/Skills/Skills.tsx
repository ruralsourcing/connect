import { gql, useQuery, useSubscription } from "@apollo/client";
import { useAuth } from "../../context/AuthenticationContext";

const GET_SKILLS = gql`
  {
    user {
      skills {
        technology {
          name
        }
        rating
      }
    }
  }
`;

const SKILLS_SUBSCRIPTION = gql`
  subscription skillAdded($userId: String!) {
    skillAdded(userId: $userId) {
      id
      userId
      rating
      Tech {
        id
        name
      }
    }
  }
`;

const Skills = () => {
  const { loading, error, data, refetch } = useQuery(GET_SKILLS);
  const auth = useAuth();

  useSubscription(SKILLS_SUBSCRIPTION, {
    variables: {
      userId: auth.user
    },
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("[SUBSCRIPTION DATA]", subscriptionData.data);
      refetch();
    },
  });

  return (
    (loading && <div>Loading...</div>) ||
    (error && <div>Error! ${error.message}`</div>) ||
    (data &&
      data.user &&
      data.user.skills.map(
        (
          skill: {
            rating: number;
            technology: {
              name: string;
            };
          },
          idx: string
        ) => (
          <div key={idx}>
            User Skill {skill.technology?.name} with rating {skill.rating}
          </div>
        )
      ))
  );
};

export default Skills;
