import BaseModel from "./baseModel";

export default class TokenInfo extends BaseModel {
  exp;
  human_exp;
  human_iat;
  logged_at;
  iat;
  ip;
  roles;
  firstname;
  lastname;
  username;
  id;
  authToken;
  legacyIntranetUrl;
  points;
  lastPoints;

  constructor(
    rawData = {
      exp: null,
      human_exp: null,
      human_iat: null,
      logged_at: null,
      iat: null,
      roles: [],
      firstname: null,
      lastname: null,
      username: null,
      id: null,
      authToken: null,
      legacyIntranetUrl: null,
      points: 0,
      lastPoints: 0
    }
  ) {
    super(rawData);

    if (rawData) {
      this.setNumber("exp", rawData.exp);
      this.setString("human_exp", rawData.human_exp);
      this.setString("human_iat", rawData.human_iat);
      this.setString("logged_at", rawData.logged_at);
      this.setNumber("iat", rawData.iat);
      this.setObject("roles", rawData.roles);
      this.setString("firstname", rawData.firstname);
      this.setString("lastname", rawData.lastname);
      this.setString("username", rawData.username);
      this.setNumber("id", rawData.id);
      this.setString("authToken", rawData.authToken);
      this.setString("legacyIntranetUrl", rawData.legacyIntranetUrl);
      this.setNumber("points", rawData.points);
      this.setNumber("lastPoints", rawData.lastPoints);
    }
  }
}
