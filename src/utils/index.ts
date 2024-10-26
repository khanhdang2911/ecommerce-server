import _ from "lodash";
type getInfoDataProps = {
  field: Array<string>;
  data: Object;
};
const getInfoData = ({ field, data }: getInfoDataProps) => {
  return _.pick(data, field);
};

const unSelectData = (select: Array<string>) => {
  return Object.fromEntries(select.map((key) => [key, 0]));
};


const nestedObjectNoUndefined = (obj: Record<string, any>) => {
  let finalObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const response: any = nestedObjectNoUndefined(obj[key]);
      Object.keys(response).forEach((nestedKey) => {
        if (response[nestedKey] !== undefined && response[nestedKey] !== null) {
          finalObj[`${key}.${nestedKey}`] = response[nestedKey];
        }
      });
    } else {
      if (obj[key] !== undefined && obj[key] !== null) {
        finalObj[key] = obj[key];
      }
    }
  });
  return finalObj;
};

export {
  getInfoData,
  unSelectData,
  nestedObjectNoUndefined,
};
