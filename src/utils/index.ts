import _ from "lodash";
type getInfoDataProps = {
  field: Array<string>;
  data: Object;
};
const getInfoData = ({ field, data }: getInfoDataProps) => {
  return _.pick(data, field);
};

export { getInfoData };
