# F1. Math you need
Goal: enough math to read how models work without fear of the symbols.

## F1.1 Vectors: meaning as numbers
**Level:** 1  **Prerequisites:** none
**Concept:** A vector is a list of numbers; closeness between vectors can stand for similarity of meaning.

**Read.** A vector is an ordered list of numbers, like coordinates. Length and direction have geometric meaning. Distance and the angle between two vectors measure how alike they are. Words, images and documents can each be turned into long vectors (embeddings).

**Why it matters in practice.** This is how search by meaning works in retrieval (3.3): the question and the chunks are vectors, and the closest chunks are returned.

**Puzzle.** Given 8 small word vectors in 2D, place a new word so that its nearest neighbors are the expected ones. Grader: computes distances and checks the neighbor list.

## F1.2 Matrices: transformations that mix numbers
**Level:** 2  **Prerequisites:** F1.1
**Concept:** A matrix turns one vector into another; model layers are mostly matrix multiplications.

**Read.** A matrix is a grid of numbers. Multiplying a vector by a matrix rotates, stretches or mixes it. Stacking many such steps, with simple bends in between, can represent complicated functions. Multiplication shapes must match.

**Why it matters in practice.** Almost all the work a model does on a GPU is matrix multiplication, which explains the hardware in F3 and the cost of long inputs in F2.2.

**Puzzle.** Multiply two small matrices by hand, then fill in the missing matrix so a given input maps to a given output. Grader: exact check of results.

## F1.3 Probability and distributions
**Level:** 1  **Prerequisites:** none
**Concept:** A probability distribution assigns a chance to each possible outcome; models output distributions over the next token.

**Read.** Probabilities are between 0 and 1 and sum to 1 over all outcomes. A distribution can be peaked (one outcome very likely) or flat. Sampling means drawing an outcome according to its probability. Expected value and variance summarize a distribution.

**Why it matters in practice.** Lesson 1.3's next-token scores are a distribution. Temperature reshapes it (F6.1).

**Puzzle.** Given a distribution over 6 next words, compute the chance of a three-word phrase and the chance of picking each word after a change in temperature. Grader: numeric tolerance.

## F1.4 Calculus: slope and gradient
**Level:** 2  **Prerequisites:** F1.1
**Concept:** The gradient tells you which way to nudge numbers to reduce an error.

**Read.** A derivative is the slope of a curve at a point. With many inputs, the gradient is the vector of slopes; it points toward the steepest increase. To reduce an error, step the opposite way. The chain rule lets slopes pass backward through stacked steps.

**Why it matters in practice.** This is how models learn (F4.2, F5.2). It also explains why training needs smooth, differentiable pieces.

**Puzzle.** Given a small function of two inputs, estimate the gradient numerically and take three steps downhill. Grader: compares the final value and path.

## F1.5 Putting it together: loss and gradient descent
**Level:** 2  **Prerequisites:** F1.3, F1.4
**Concept:** A loss measures how wrong predictions are; gradient descent repeatedly adjusts parameters to lower it.

**Read.** Choose a loss (such as how much probability the model gave to the correct next word). Compute it over examples, find the gradient with respect to the parameters, and step against it. Repeat many times. Learning rate controls step size: too big overshoots, too small crawls.

**Why it matters in practice.** This single loop, scaled up, is how every large model is trained (F5.2).

**Puzzle.** Fit a line to noisy points by writing a short gradient descent loop; then break it with a bad learning rate and explain why. Grader: final error under a threshold, and a correct diagnosis.
