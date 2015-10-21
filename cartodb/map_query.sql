SELECT
  *,
  CAST(top_bullet_votes AS DOUBLE PRECISION) / (_0_votes + _1_votes + _2_votes + _3_votes + _4_votes + _5_votes) as top_bullet_scale
FROM cartodb_query