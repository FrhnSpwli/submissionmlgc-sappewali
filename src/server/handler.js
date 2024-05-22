const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");
const getData = require("../services/getData"); 

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  try {
    const { confidenceScore, label, suggestion } = await predictClassification(
      model,
      image
    );

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      confidenceScore: confidenceScore,
      createdAt: createdAt,
    };

    await storeData(id, data);

    const response = h.response({
      status: "success",
      message:
        confidenceScore > 99
          ? "Model is predicted successfully"
          : "Model is predicted successfully but under threshold. Please use the correct picture",
      data,
    });
    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
    response.code(400);
    return response;
  }
}

async function getPredictionHistoriesHandler(request, h) {
  try {
    const histories = await getData();

    const data = histories.map((history) => {
      return {
        id: history.id,
        result: history.result,
        suggestion: history.suggestion,
        confidenceScore: history.confidenceScore,
        createdAt: history.createdAt,
      };
    });

    const response = h.response({
      status: "success",
      data: data,
    });
    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: "fail",
      message: "Terjadi kesalahan dalam mengambil riwayat prediksi",
    });
    response.code(400);
    return response;
  }
}

module.exports = {postPredictHandler, getPredictionHistoriesHandler};
