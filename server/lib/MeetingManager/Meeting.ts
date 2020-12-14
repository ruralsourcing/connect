export interface Meeting {
    id: number;
    uuid: string;
    host_id: string;
    host_email: string;
    topic: string;
    start_url: string;
    join_url: string;
    password: string;
  }