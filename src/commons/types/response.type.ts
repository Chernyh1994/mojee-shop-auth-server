export type ResponseMessageType = {
  data: string;
};

export type ResponseDataType = {
  data: { [key: string]: string };
};

export type ResponseTokensType = {
  accessToken: string;
  refreshToken: string;
};
