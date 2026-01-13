import {
  Card,
  CardContent,
  Typography,
  Divider,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

export default function QuizQuestionCard({ question, selectedOptionId, onSelect }) {
  if (!question) return null;

  const qText = question.question_text ?? question.text ?? "Întrebare";
  const options = question.options ?? [];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {qText}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <FormControl fullWidth>
          <RadioGroup
            value={selectedOptionId ?? ""}
            onChange={(e) => onSelect(question.id, Number(e.target.value))}
          >
            {options.map((opt) => {
              const label = opt.option_text ?? opt.text ?? "Opțiune";
              return (
                <FormControlLabel
                  key={opt.id}
                  value={opt.id}
                  control={<Radio />}
                  label={label}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
}
