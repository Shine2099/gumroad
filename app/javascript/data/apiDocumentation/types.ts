import type React from "react";

export type ApiParameter = {
  name: string;
  description?: string;
  required?: boolean;
};

export type ApiMethod = {
  type: string;
  path: string;
  description: React.ReactNode;
  isOAuth?: boolean;
  parameters?: ApiParameter[];
  curlExample?: string;
  responseExample?: string;
};

export type ApiResource = {
  name: string;
  methods: ApiMethod[];
};

export type ApiScope = {
  name: string;
  description: string;
};

export type ApiErrorCode = {
  code: string;
  description: string;
};

export type ApiLink = {
  title: string;
  url: string;
};

export type ApiResourceLink = {
  title: string;
  description: string;
  url?: string;
  isHelper?: boolean;
};
