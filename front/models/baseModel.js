import moment from "moment";

export default class BaseModel
{
  id;
  created;

  constructor(
    rawData = {
      id: null,
      created: null,
    }
  )
  {
    if (rawData)
    {
      if (rawData.id) this.setNumber("id", rawData.id);
      if (rawData.created) this.setString("created", rawData.created);
      else this.setString("created", moment().format("YYYY-MM-DD HH:mm:ss"))
    }
  }

  setValue(propertyName, value)
  {
    if (propertyName in this) this[propertyName] = value;
    else return false;
  }

  setBoolean(propertyName, value)
  {
    this.setValue(propertyName, Boolean(value));
  }

  setNumber(propertyName, value)
  {
    if (
      typeof value == "number" ||
      typeof value == "undefined" ||
      value === null
    )
      this.setValue(propertyName, value);
    else return false;
  }

  setString(propertyName, value)
  {
    if (typeof value == "string" || value === null)
      this.setValue(propertyName, value);
    else return false;
  }

  setObject(propertyName, value)
  {
    if (typeof value != "undefined") this.setValue(propertyName, value);
    else return false;
  }

  addObject(propertyName, value)
  {
    if (typeof value != "undefined") this[propertyName].push(value);
    else return false;
  }
}
