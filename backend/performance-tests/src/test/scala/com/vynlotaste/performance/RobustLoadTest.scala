package com.vynlotaste.performance

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._
import scala.language.postfixOps

class RobustLoadTest extends Simulation {

  val httpProtocol = http
    .baseUrl("http://localhost:8080")
    .acceptHeader("application/json")

  val healthCheck = scenario("Health Check")
    .exec(http("health")
      .get("/api/v1/health")
      .check(status.is(200)))
    .pause(1.second, 3.seconds)

  val performanceMetrics = scenario("Performance Metrics")
    .exec(http("metrics")
      .get("/api/v1/performance/metrics")
      .check(status.is(200)))
    .pause(2.seconds, 5.seconds)

  setUp(
    healthCheck.inject(
      rampUsers(10).during(10.seconds),
      rampUsers(50).during(20.seconds),
      rampUsers(100).during(30.seconds)
    ),
    performanceMetrics.inject(
      rampUsers(15).during(30.seconds),
      rampUsers(30).during(20.seconds)
    )
  ).protocols(httpProtocol)
   .maxDuration(5.minutes)
   .assertions(
     global.responseTime.percentile3.lt(2000),
     global.successfulRequests.percent.gt(85)
   )
}