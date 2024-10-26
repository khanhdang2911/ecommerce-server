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
export { getInfoData, unSelectData };
