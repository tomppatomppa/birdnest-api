import xml2js from 'xml2js'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

export const parseXmlToJsonObject = (body) => {
  let drones
  xml2js.parseString(body, { trim: true }, (err, result) => {
    if (err) {
      throw err
    }
    const obj = JSON.parse(JSON.stringify(result, null, 4))
    const snapshotTimestamp = obj.report.capture[0].$.snapshotTimestamp

    drones = obj.report.capture[0].drone.map((drone) => {
      return parseDroneFields(drone, snapshotTimestamp)
    })
    //console.log(util.inspect(drones, false, null))
  })
  return drones
}

/**
 *
 * @param {*} drone
 * @returns A drone object without properties as arrays
 */
export const parseDroneFields = (drone, snapshotTimestamp) => {
  const droneObjectParsed = {
    serialNumber: drone.serialNumber[0],
    model: drone.model[0],
    manufacturer: drone.manufacturer[0],
    mac: drone.mac[0],
    ipv4: drone.ipv4[0],
    ipv6: drone.ipv6[0],
    firmware: drone.firmware[0],
    positionY: drone.positionY[0],
    positionX: drone.positionX[0],
    altitude: drone.altitude[0],
    snapshotTimestamp: snapshotTimestamp,
    confirmedDistance: getDistanceFromCenter(
      drone.positionX[0],
      drone.positionY[0]
    ),
  }
  return droneObjectParsed
}
export const getDistanceFromCenter = (x, y) => {
  const centerX = 250000
  const centerY = 250000

  let distanceX = Math.abs(x - centerX)
  let distanceY = Math.abs(y - centerY)
  let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

  return distance / 1000
}
//http://localhost:4000/
//https://birdnest-api.herokuapp.com/
export const sendRequestToGraphqlEndpoint = () => {
  fetch('http://localhost:4000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
         query getSensorData {
            getSensorData(apiKey: ${process.env.API_KEY}) 
         }
          `,
      variables: {},
    }),
  })
}
