package com.vynlotaste.performance

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._
import scala.language.postfixOps

class PublicEndpointsTest extends Simulation {

  val httpProtocol = http
    .baseUrl("http://localhost:8080")
    .acceptHeader("application/json")

  val healthCheck = scenario("Health Check")
    .exec(http("health")
      .get("/api/v1/health")
      .check(status.in(200, 404)))
    .pause(1.second, 3.seconds)

  val performanceHealth = scenario("Performance Health")
    .exec(http("perf_health")
      .get("/api/v1/performance/health")
      .check(status.in(200, 404)))
    .pause(2.seconds, 5.seconds)

  setUp(
    healthCheck.inject(
      rampUsers(50).during(30.seconds),
      rampUsers(100).during(60.seconds)
    ),
    performanceHealth.inject(
      rampUsers(25).during(45.seconds)
    )
  ).protocols(httpProtocol)
   .maxDuration(2.minutes)
   .assertions(
     global.responseTime.percentile3.lt(5000),
     global.successfulRequests.percent.gt(50)
   )
}