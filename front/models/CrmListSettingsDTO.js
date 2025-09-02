import BaseModel from "./baseModel";

export default class CrmListSettingsDTO extends BaseModel {
  name;
  context;
  isPublic;
  type;
  user;

  constructor(
    rawData = {
      name: null,
      context: {},
      isPublic: false,
      type: null,
      user: null
    }
  ) {
    super(rawData);

    if (rawData) {
      if(rawData.name) this.setString("name", rawData.name);
      if(rawData.context) this.setObject("context", rawData.context);
      if(rawData.isPublic) this.setBoolean("isPublic", rawData.isPublic);
      if(rawData.user) this.setObject("user", rawData.user);
    }
  }
}
