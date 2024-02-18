import { Hex } from 'viem';

type Land = {
  name: string;
  landurl: string;
  imageurl: string;
};

export interface LandResponse {
  data?: {
    philandList: {
      data: Land[];
    };
  };
  error?: Error;
}

export interface TriggerResponse {
  conditionTrigger: {
    success: boolean;
  };
  error?: Error;
}
