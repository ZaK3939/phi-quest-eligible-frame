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
  data?: {
    conditionTrigger: {
      success: boolean;
    };
  };
  error?: Error;
}
