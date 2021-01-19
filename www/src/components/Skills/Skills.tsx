import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { message } from "antd";

const GET_SKILLS = gql`
  {
    user {
      skills {
        id
        technology {
          name
        }
        rating
      }
    }
  }
`;

const SKILL_ADDED_SUBSCRIPTION = gql`
  subscription {
    skillAdded {
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

const SKILL_DELETED_SUBSCRIPTION = gql`
  subscription {
    skillDeleted
  }
`;

const MEETING_CREATED_SUBSCRIPTION = gql`
  subscription {
    meetingStarted {
      start_url
      join_url
    }
  }
`;

const DELETE_SKILL = gql`
  mutation deleteSkill($skillId: ID!) {
    deleteSkill(skillId: $skillId)
  }
`;

const Skills = () => {
  const { loading, error, data, refetch } = useQuery(GET_SKILLS);

  const [deleteSkill] = useMutation(DELETE_SKILL);

  useSubscription(SKILL_ADDED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      message.info("Skill Added!!");
      refetch();
    },
  });

  useSubscription(MEETING_CREATED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      message.info("Meeting Created!!");
    },
  });

  useSubscription(SKILL_DELETED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      message.info("Skill Deleted!!");
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
            id: string;
            rating: number;
            technology: {
              name: string;
            };
          },
          idx: string
        ) => (
          <div key={idx}>
            <button
              onClick={() => {
                console.log(skill);
                deleteSkill({
                  variables: {
                    skillId: skill.id,
                  },
                })
                  .then(() => refetch())
                  .catch((error) => {
                    console.log(error);
                    refetch();
                  });
              }}
            >
              DELETE
            </button>
            User Skill {skill.technology?.name} with rating {skill.rating}
          </div>
        )
      ))
  );
};

export default Skills;
