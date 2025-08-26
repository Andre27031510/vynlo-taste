package com.vynlotaste.performance

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._
import scala.language.postfixOps

class EnduranceTestRobust extends Simulation {

  val httpProtocol = http
    .baseUrl("http://localhost:8080")
    .acceptHeader("application/json")

  val enduranceScenario = scenario("Endurance Test")
    .exec(http("health_endurance")
      .get("/api/v1/health")
      .check(status.is(200)))
    .pause(10.seconds, 30.seconds)
    .exec(http("metrics_endurance")
      .get("/api/v1/performance/metrics")
      .check(status.is(200)))
    .pause(15.seconds, 45.seconds)

  setUp(
    enduranceScenario.inject(
      rampUsers(20).during(5.minutes),
      rampUsers(50).during(110.minutes)
    )
  ).protocols(httpProtocol)
   .maxDuration(2.hours)
   .assertions(
     global.responseTime.mean.lt(5000),
     global.successfulRequests.percent.gt(95)
   )
}