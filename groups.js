import _ from 'underscore'

const mship = JSON.parse(process.env.USERS)

export default function getGroups(uid) {
  return _.reduce(_.pairs(mship), (acc, pair) => {
    if(pair[1].indexOf(uid) >= 0) acc.push(pair[0])
    return acc
  }, [])
}
