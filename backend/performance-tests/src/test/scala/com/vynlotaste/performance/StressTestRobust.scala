package com.vynlotaste.performance

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._
import scala.language.postfixOps

class StressTestRobust extends Simulation {

  val httpProtocol = http
    .baseUrl("http://localhost:8080")
    .acceptHeader("application/json")

  val stressScenario = scenario("Stress Test")
    .exec(http("health_stress")
      .get("/api/v1/health")
      .check(status.in(200, 429, 503, 500)))
    .pause(100.milliseconds, 500.milliseconds)
    .exec(http("metrics_stress")
      .get("/api/v1/performance/metrics")
      .check(status.in(200, 429, 503, 500)))
    .pause(200.milliseconds, 1.second)

  setUp(
    stressScenario.inject(
      rampUsers(100).during(30.seconds),
      rampUsers(500).during(60.seconds),
      rampUsers(1000).during(60.seconds)
    )
  ).protocols(httpProtocol)
   .maxDuration(10.minutes)
   .assertions(
     global.responseTime.percentile4.lt(30000),
     global.failedRequests.percent.lt(50)
   )
}