from django.core.exceptions import ValidationError


def score_validator(value):
    # Format: runs/wickets
    if value:
        if '/' in value:
            vals = value.split('/')
            try:
                vals[0] = int(vals[0])
                vals[1] = int(vals[1])
                if vals[1] > 10:
                    raise ValidationError("Invalid format")
            except:
                raise ValidationError("Invalid format")
        else:
            raise ValidationError('Invalid format')
