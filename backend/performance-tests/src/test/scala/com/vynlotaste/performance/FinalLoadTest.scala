package com.vynlotaste.performance

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._
import scala.language.postfixOps

class FinalLoadTest extends Simulation {

  val httpProtocol = http
    .baseUrl("http://localhost:8080")
    .acceptHeader("application/json")

  val loadTest = scenario("Load Test")
    .exec(http("health_check")
      .get("/api/v1/health")
      .check(status.in(200, 403, 404)))
    .pause(1.second, 2.seconds)
    .exec(http("performance_health")
      .get("/api/v1/performance/health")
      .check(status.in(200, 403, 404)))
    .pause(1.second, 3.seconds)

  setUp(
    loadTest.inject(
      rampUsers(100).during(60.seconds),
      rampUsers(200).during(120.seconds)
    )
  ).protocols(httpProtocol)
   .maxDuration(3.minutes)
}