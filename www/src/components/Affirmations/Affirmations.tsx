import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { User } from "@prisma/client";
import { message } from "antd";

const GET_USERS = gql`
  {
    users {
      id
      email
    }
  }
`;

const SEND_AFFIRMATION = gql`
  mutation sendAffirmation($userId: ID!) {
    sendAffirmation(userId: $userId) {
        from
        to
    }
  }
`;

const AFFIRMATION_GIVEN_SUBSCRIPTION = gql`
  subscription {
    affirmationGiven {
        from
        to
    }
  }
`;

const Affirmations = () => {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [sendAffirmation] = useMutation(SEND_AFFIRMATION);

  useSubscription(AFFIRMATION_GIVEN_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      message.info("Affirmation Given!!");
      //refetch();
    },
  });

  return (
    (loading && <div>Loading...</div>) ||
    (error && <div>Error! ${error.message}`</div>) ||
    (data &&
      data.users.map((user: User) => {
        return (
          <>
            <button onClick={() => {
                sendAffirmation({
                    variables: {
                        userId: user.id
                    }
                })
            }}>Give Kudos</button>
            <div>{user.email}</div>
          </>
        );
      }))
  );
};

export default Affirmations;
