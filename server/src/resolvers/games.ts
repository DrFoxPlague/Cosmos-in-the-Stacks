import GameModel from "../schemas/Game/Game";
import TriviaQuestionModel from "../schemas/Game/TriviaQuestion";
import { GraphQLError } from "graphql";
import GenID from "../util/GenID";

type GameDataInput = {
    name: string;
    subject: string;
};

type QuestionInput = {
    question: string;
    choices: string[];
    answer: string;
};

export default {
    Query: {
        getGame: async (_: any, { id }: { id: string }) => {
            try {
                // fetch game object
                // const game = await GameModel.findOne({ id }); // We need to use findById
                const game = await GameModel.findById(id);

                if (!game) {
                    throw new GraphQLError("Game not found!", {
                        extensions: {
                            errors: [
                                {
                                    type: "game",
                                    message: "Game not found!",
                                },
                            ],
                        },
                    });
                }

                // fetch questions
                const questionSelection = [...game.questions];

                // retrieve only 5 random questions
                game.questions = questionSelection
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 5);

                return game;
            } catch (err) {
                throw err;
            }
        },

        getGames: async () => (await GameModel.find()).toSorted(),
    },
    Mutation: {
        createGame: async (
            _: any,
            { input }: { input: GameDataInput },
            context: { isStaff: boolean }
        ) => {
            try {
                // check if user is staff
                if (!context.isStaff) {
                    throw new GraphQLError("Not authenticated!", {
                        extensions: {
                            errors: [
                                {
                                    type: "authentication",
                                    message: "Staff member not authenticated!",
                                },
                            ],
                        },
                    });
                }

                const game = new GameModel({
                    _id: GenID.game(),
                    name: input.name,
                    subject: input.subject,
                    questions: [],
                });

                await game.save();

                return game;
            } catch (err) {
                throw err;
            }
        },

        updateGame: async (
            _: any,
            { id, input }: { id: string; input: Partial<GameDataInput> },
            context: { isStaff: boolean }
        ) => {
            try {
                if (!context.isStaff) {
                    throw new GraphQLError("Not authenticated!", {
                        extensions: {
                            errors: [
                                {
                                    type: "authentication",
                                    message: "Staff member not authenticated!",
                                },
                            ],
                        },
                    });
                }

                // const game = await GameModel.findOne({ id }); // We need to use findById
                const game = await GameModel.findById(id);

                if (!game) {
                    throw new GraphQLError("Game not found!", {
                        extensions: {
                            errors: [
                                {
                                    type: "game",
                                    message: "Game not found!",
                                },
                            ],
                        },
                    });
                }

                if (input.name) game.name = input.name;
                if (input.subject) game.subject = input.subject;

                await game.save();

                return game;
            } catch (err) {
                throw err;
            }
        },

        deleteGame: async (
            _: any,
            { id }: { id: string },
            context: { isStaff: boolean }
        ) => {
            try {
                if (!context.isStaff) {
                    throw new GraphQLError("Not authenticated!", {
                        extensions: {
                            errors: [
                                {
                                    type: "authentication",
                                    message: "Staff member not authenticated!",
                                },
                            ],
                        },
                    });
                }

                // const game = await GameModel.findOne({ id }); // We need to use findById
                const game = await GameModel.findById(id);

                if (!game) {
                    throw new GraphQLError("Game not found!", {
                        extensions: {
                            errors: [
                                {
                                    type: "game",
                                    message: "Game not found!",
                                },
                            ],
                        },
                    });
                }

                // await GameModel.findByIdAndDelete(id); // We need to use deleteOne, since finding it again is redundant
                await game.deleteOne();

                return game;
            } catch (err) {
                throw err;
            }
        },

        createTrivQues: async (
            _: any,
            { input }: { input: QuestionInput },
            context: { isStaff: boolean }
        ) => {
            try {
                if (!context.isStaff) {
                    throw new GraphQLError("Not authenticated!", {
                        extensions: {
                            errors: [
                                {
                                    type: "authentication",
                                    message: "Staff member not authenticated!",
                                },
                            ],
                        },
                    });
                }

                const triviaQuestion = new TriviaQuestionModel({
                    _id: GenID.triviaQuestion(),
                    question: input.question,
                    choices: input.choices,
                    answer: input.answer,
                });

                await triviaQuestion.save();

                return triviaQuestion;
            } catch (err) {
                throw err;
            }
        },

        updateTrivQues: async (
            _: any,
            { id, input }: { id: string; input: QuestionInput },
            context: { isStaff: boolean }
        ) => {
            try {
                if (!context.isStaff) {
                    throw new GraphQLError("Not authenticated!", {
                        extensions: {
                            errors: [
                                {
                                    type: "authentication",
                                    message: "Staff member not authenticated!",
                                },
                            ],
                        },
                    });
                }

                const triviaQuestion = await TriviaQuestionModel.findById(id);

                if (!triviaQuestion) {
                    throw new GraphQLError("Trivia question not found!", {
                        extensions: {
                            errors: [
                                {
                                    type: "trivia question",
                                    message: "Trivia question not found!",
                                },
                            ],
                        },
                    });
                }

                if (input.question) triviaQuestion.question = input.question;
                if (input.choices) triviaQuestion.choices = input.choices;
                if (input.answer) triviaQuestion.answer = input.answer;

                await triviaQuestion.save();

                return triviaQuestion;
            } catch (err) {
                throw err;
            }
        },

        deleteTrivQues: async (
            _: any,
            { id }: { id: string },
            context: { isStaff: boolean }
        ) => {
            try {
                if (!context.isStaff) {
                    throw new GraphQLError("Not authenticated!", {
                        extensions: {
                            errors: [
                                {
                                    type: "authentication",
                                    message: "Staff member not authenticated!",
                                },
                            ],
                        },
                    });
                }

                const triviaQuestion = await TriviaQuestionModel.findById(id);

                if (!triviaQuestion) {
                    throw new GraphQLError("Trivia question not found!", {
                        extensions: {
                            errors: [
                                {
                                    type: "trivia question",
                                    message: "Trivia question not found!",
                                },
                            ],
                        },
                    });
                }

                await triviaQuestion.deleteOne();

                return triviaQuestion;
            } catch (err) {
                throw err;
            }
        },

        addQuestion: async (
            _: any,
            { gameId, question }: { gameId: string; question: string },
            context: { isStaff: boolean }
        ) => {
            try {
                if (!context.isStaff) {
                    throw new GraphQLError("Not authenticated!", {
                        extensions: {
                            errors: [
                                {
                                    type: "authentication",
                                    message: "Staff member not authenticated!",
                                },
                            ],
                        },
                    });
                }

                const game = await GameModel.findById(gameId);

                if (!game) {
                    throw new GraphQLError("Game not found!", {
                        extensions: {
                            errors: [
                                {
                                    type: "game",
                                    message: "Game not found!",
                                },
                            ],
                        },
                    });
                }

                if (question) game.questions.push(question);

                await game.save();

                return game;
            } catch (err) {
                throw err;
            }
        },

        removeQuestion: async (
            _: any,
            { gameId, question }: { gameId: string; question: string },
            context: { isStaff: boolean }
        ) => {
            try {
                if (!context.isStaff) {
                    throw new GraphQLError("Not authenticated!", {
                        extensions: {
                            errors: [
                                {
                                    type: "authentication",
                                    message: "Staff member not authenticated!",
                                },
                            ],
                        },
                    });
                }

                const game = await GameModel.findById(gameId);

                if (!game) {
                    throw new GraphQLError("Game not found!", {
                        extensions: {
                            errors: [
                                {
                                    type: "game",
                                    message: "Game not found!",
                                },
                            ],
                        },
                    });
                }

                if (question) {
                    const qIdx = game.questions.findIndex(
                        (qID: string) => qID === question
                    );

                    if (qIdx === -1) {
                        throw new GraphQLError("Question not found in array!", {
                            extensions: {
                                errors: [
                                    {
                                        type: "question",
                                        message: "Question not found in array!",
                                    },
                                ],
                            },
                        });
                    }

                    game.questions.splice(qIdx, 1);

                    await game.save();

                    return game;
                }
            } catch (err) {
                throw err;
            }
        },
    },
};
